import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Two-factor authentication (TOTP) helpers.
 *
 * Flow:
 *  1. enrollTotp() -> show the returned QR code, ask the user to scan it
 *     with an authenticator app (Google Authenticator, Authy, etc.)
 *  2. verifyTotpEnrollment(factorId, code) -> user enters the 6-digit code
 *     their app is showing right now; this completes enrollment
 *  3. On every future login, once the password is correct, checkAssuranceLevel()
 *     reports that a second factor is required; verifyTotpLogin(factorId, code)
 *     completes it.
 */

export async function enrollTotp() {
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
  if (error) throw error;
  return { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
}

export async function verifyTotpEnrollment(factorId: string, code: string) {
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
  if (challengeError) throw challengeError;
  const { error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code });
  if (verifyError) throw verifyError;
}

export async function verifyTotpLogin(factorId: string, code: string) {
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) throw error;
}

export async function listTotpFactors() {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return data.totp;
}

export async function unenrollTotp(factorId: string) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw error;
}

async function checkAssuranceLevel() {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) throw error;
  return data;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChecked, setMfaChecked] = useState(false);

  const refreshMfaStatus = async () => {
    setMfaChecked(false);
    try {
      const { currentLevel, nextLevel } = await checkAssuranceLevel();
      if (nextLevel === "aal2" && currentLevel !== "aal2") {
        const factors = await listTotpFactors();
        setMfaFactorId(factors[0]?.id ?? null);
      } else {
        setMfaFactorId(null);
      }
    } catch {
      setMfaFactorId(null);
    } finally {
      setMfaChecked(true);
    }
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      setMfaFactorId(null);
      setMfaChecked(true);
      return;
    }
    refreshMfaStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, session?.access_token]);

  return {
    loading: session === undefined || (!!session && !mfaChecked),
    user: session?.user ?? null,
    // A pending second-factor challenge — true once the password is verified
    // but the TOTP code has not been entered yet this session.
    mfaFactorId,
    mfaRequired: !!mfaFactorId,
    refreshMfaStatus,
    logout: signOut,
  };
}
