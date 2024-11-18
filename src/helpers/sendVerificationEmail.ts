import { Resend } from 'resend';
import VerificationEmail from '../../emails/verificationEmailTemplate';
import { ApiResponse } from '@/types/ApiResponse';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string,
): Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code | FeedIn',
            react: VerificationEmail({ username: username, verificationCode: verificationCode }),
          });

          return {
            success: true,
            message: "Verification Code sent successfully",
          }
    } catch (emailError) {
        console.error("Error sending verification email ", emailError);
        return {
            success: false,
            message: "Failed to send verification code",
        }
    }
}
