export const tempPassTempReplace = {
    tempPassword: 'TEMP_PASS_KEY_REPLACE',
    loginUrl: 'LOGIN_URL_KEY_REPLACE',
};

export const temporaryPasswordTemplateHTML = `
<div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
    
    <div style="padding: 20px 32px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center;">
        <table width="100%">
        <tr>
            <td style="vertical-align: middle;">
            <div style="display: inline-block; width: 32px; height: 32px; background-color: #4f46e5; border-radius: 8px; text-align: center; line-height: 32px;">
                <span style="color: white; font-weight: bold; font-size: 18px;">T</span>
            </div>
            <span style="font-size: 20px; font-weight: bold; color: #0f172a; margin-left: 8px; vertical-align: middle;">ToyStore</span>
            </td>
        </tr>
        </table>
    </div>

    <div style="padding: 40px 32px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 16px;">Reset your password</h1>
        <p style="font-size: 16px; color: #64748b; line-height: 24px; margin-bottom: 32px;">
        We received a request to access your ToyStore account. Use the temporary password below to sign back in.
        </p>

        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <p style="text-transform: uppercase; letter-spacing: 0.05em; font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 8px;">Temporary Magic Key</p>
        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 2px;">
            ${tempPassTempReplace.tempPassword}
        </div>
        </div>

        <div style="text-align: center;">
        <a href="${tempPassTempReplace.loginUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);">
            Sign in to ToyStore
        </a>
        </div>

        <div style="margin-top: 40px; padding: 16px; background-color: #f1f5f9; border-radius: 12px;">
        <p style="margin: 0; font-size: 14px; color: #475569; line-height: 20px;">
            <strong>Safety Tip:</strong> This code is valid for a limited time. Once you log in, please visit your <b>Account Settings</b> to set a new permanent password.
        </p>
        </div>
    </div>

    <div style="padding: 32px; background-color: #ffffff; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="font-size: 14px; color: #94a3b8; margin-bottom: 8px;">
        © 2026 ToyStore Inc. Made with 🧸 for big kids.
        </p>
        <div style="font-size: 12px; color: #cbd5e1;">
        If you didn't request this email, you can safely ignore it.
        </div>
    </div>
    </div>
</div>
`;