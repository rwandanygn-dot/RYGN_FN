/** Email that receives all website form submissions (set in Formspree dashboard). */
export const FORM_RECIPIENT_EMAIL = 'irakozekelly41@gmail.com';

export function getFormspreeEndpoint(): string | null {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
  if (!formId) return null;
  if (formId.startsWith('http://') || formId.startsWith('https://')) {
    return formId;
  }
  return `https://formspree.io/f/${formId}`;
}

export async function submitToFormspree(
  formName: string,
  fields: Record<string, string | string[]>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const endpoint = getFormspreeEndpoint();

  if (!endpoint) {
    return {
      ok: false,
      error:
        'Forms are not connected yet. Add your Formspree form ID to .env.local (see .env.example).',
    };
  }

  const payload: Record<string, string | string[]> = {
    _subject: `[RYGN Website] ${formName}`,
    _form: formName,
    ...fields,
  };

  const email = fields.email;
  if (typeof email === 'string' && email) {
    payload._replyto = email;
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      error: 'Could not reach the server. Check your connection and try again.',
    };
  }

  if (response.ok) {
    return { ok: true };
  }

  let message = 'Something went wrong. Please try again.';
  try {
    const data = (await response.json()) as { error?: string };
    if (data.error) message = data.error;
  } catch {
    // use default message
  }

  return { ok: false, error: message };
}
