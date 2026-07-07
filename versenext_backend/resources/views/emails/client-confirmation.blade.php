<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VerseNext – Inquiry Received</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0; padding:0; background-color:#0b0f1a; font-family:Arial, Helvetica, sans-serif;">

<!-- Outer Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0f1a; padding:40px 0;">
    <tr>
        <td align="center">

            <!-- Main Card -->
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0f172a; border-radius:14px; overflow:hidden; border:1px solid #1f2937; box-shadow:0 0 40px rgba(59,130,246,0.18);">

                <!-- Header (Light for Black Logo Text) -->
                <tr>
                    <td align="center" style="background-color:#ffffff; padding:26px 20px; border-bottom:1px solid #e5e7eb;">
                        <img
                            src="https://versenext.com/_next/static/media/logo.8e025636.png"
                            alt="VerseNext Logo"
                            style="max-width:280px; width:auto; height:auto; display:block;"
                        >
                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding:34px 40px; color:#d1d5db; font-size:14px; line-height:1.7;">

                        <p style="margin:0 0 16px; color:#e5e7eb;">
                            Hi <strong style="color:#ffffff;">{{ $inquiry->full_name }}</strong>,
                        </p>

                        <p style="margin:0 0 16px;">
                            Thank you for reaching out to
                            <strong style="color:#60a5fa;">VerseNext</strong>.
                        </p>

                        <p style="margin:0 0 22px;">
                            Your project inquiry has been successfully received and is now
                            under technical review. Our engineering team is analyzing your
                            requirements and will contact you shortly with the next steps.
                        </p>

                        <!-- Status Badge -->
                        <table cellpadding="0" cellspacing="0" style="margin:0 0 26px;">
                            <tr>
                                <td style="padding:8px 14px; background-color:#0b1220; border:1px solid #2563eb; border-radius:20px; color:#60a5fa; font-size:12px;">
                                    ● Inquiry Status: Received
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0; color:#e5e7eb;">
                            Best regards,<br>
                            <strong style="color:#ffffff;">VerseNext Engineering Team</strong>
                        </p>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" style="background-color:#020617; padding:16px; font-size:12px; color:#6b7280; border-top:1px solid #1f2937;">
                        © {{ date('Y') }} VerseNext · Building scalable digital solutions
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
