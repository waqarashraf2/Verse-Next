<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VerseNext – Notification</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0; padding:0; background-color:#0b0f1a; font-family:Arial, Helvetica, sans-serif; color:#d1d5db;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0f1a; padding:40px 0;">
    <tr>
        <td align="center">

            <!-- Main card -->
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0f172a; border-radius:14px; overflow:hidden; border:1px solid #1f2937; box-shadow:0 0 40px rgba(59,130,246,0.18);">

                <!-- Header / Logo -->
                <tr>
                    <td align="center" style="background-color:#ffffff; padding:26px 20px; border-bottom:1px solid #e5e7eb;">
                        <img
                            src="{{ config('app.url') }}/logos/icon%20blue.png"
                            alt="Verse Next"
                            width="260"
                            style="display:block; width:auto; height:auto;"
                        >
                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding:34px 40px; font-size:14px; line-height:1.7;">

                        <!-- Greeting -->
                        <h1 style="margin:0 0 20px; font-size:22px; color:#ffffff; font-weight:bold;">
                            Hello {{ $clientName }},
                        </h1>

                        <!-- Message Content -->
                        <div style="margin-bottom:25px; color:#d1d5db;">
                            {!! nl2br(e($messageContent)) !!}
                        </div>

                        <!-- Status Panel -->
                        <div style="margin-bottom:25px; padding:15px 20px; background-color:#0b1220; border:1px solid #2563eb; border-radius:10px; color:#60a5fa; font-size:13px; display:inline-block;">
                            <strong>Status:</strong> Notification Sent<br>
                            <strong>Team:</strong> VerseNext<br>
                            <strong>Action:</strong> Please check your account
                        </div>

                        <!-- CTA Button -->
                        <div style="margin-bottom:30px;">
                            <a href="https://versenext.com" 
                               style="display:inline-block; background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 25px; border-radius:8px; font-weight:bold; font-size:14px;">
                               Visit Our Website
                            </a>
                        </div>

                        <!-- Closing -->
                        <p style="margin:0; color:#d1d5db;">
                            Thanks,<br>
                            <strong style="color:#ffffff;">VerseNext Team</strong>
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
