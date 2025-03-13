
import {
    HTML,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
} from '@react-email'

interface VerificationEmailProps {
    username: string
    otp: string
}

export default function VerificationEmail({
    username,
    otp,
}: VerificationEmailProps) {
    return (
        <HTML lang="en" dir="ltr">
            <Head>
                <title>Verification Email</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{ url: '' }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {username}, </Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering. Please use the following
                        verification code to complete your registration:
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Text>
                        If you did not request this code, please ignore this
                        email.
                    </Text>
                </Row>

                {/* <Row>
                    <Button
                        href={'http://localhost:3000/verify/${username}
                        style={{ color:
                        '#61dafb', 3}
                        Verify here
                    </Button>
                    </Rows */}
            </Section>
        </HTML>
    )
}
