export const registerTempReplace = {
    userName: 'TEMP_USERNAME_KEY_REPLACE',
    url: 'LOGIN_URL_KEY_REPLACE',
};
export const registeredUserTemplate = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a ToyStore</title>
    <style>
        /* Basic Resets */
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        table { border-spacing: 0; }
        td { padding: 0; }
        img { border: 0; }
        .content { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .btn {
            background-color: #4f46e5;
            color: #ffffff !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: bold;
            display: inline-block;
        }
        @media screen and (max-width: 600px) {
            .column { display: block !important; width: 100% !important; padding: 10px 0 !important; }
        }
    </style>
</head>
<body>
    <table width="100%" bgcolor="#f8fafc" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="content" cellpadding="0" cellspacing="0" style="border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    
                    <tr>
                        <td style="padding: 30px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                            <table align="center">
                                <tr>
                                    <td bgcolor="#4f46e5" style="width: 32px; height: 32px; border-radius: 8px; text-align: center; color: #ffffff; font-weight: bold; font-size: 20px;">T</td>
                                    <td style="padding-left: 10px; font-size: 20px; font-weight: bold; color: #0f172a;">ToyStore</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px;">
                            <h1 style="margin: 0 0 10px 0; color: #0f172a; font-size: 24px; font-weight: bold;">¡Welcome to the fun, ${registerTempReplace.userName}! 👋</h1>
                            <p style="margin: 0 0 25px 0; color: #64748b; font-size: 16px; line-height: 1.6;">
                                We're so excited that you've joined us! <strong>ToyStore</strong>. Your account is now active and ready for you to start exploring the largest toy catalog.
                            </p>
                            <a href="${registerTempReplace.url}" class="btn">Explore the store</a>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="column" width="48%" bgcolor="#ffffff" style="border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 500;">Welcome Gift</p>
                                        <h3 style="margin: 5px 0 0 0; color: #0f172a; font-size: 20px; font-weight: bold;">500 pts</h3>
                                    </td>
                                    <td width="4%">&nbsp;</td>
                                    <td class="column" width="48%" bgcolor="#4f46e5" style="border-radius: 20px; padding: 20px;">
                                        <p style="margin: 0; color: #e0e7ff; font-size: 14px; font-weight: 500;">Your first coupon</p>
                                        <h3 style="margin: 5px 0 0 0; color: #ffffff; font-size: 20px; font-weight: bold;">TOY20</h3>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 30px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                ToyStore Inc. • Made with 🧸 for big kids.
                            </p>
                            <div style="margin-top: 15px;">
                                <a href="#" style="color: #4f46e5; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy</a>
                                <a href="#" style="color: #4f46e5; text-decoration: none; font-size: 12px; margin: 0 10px;">Help</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
