import * as React from "react";
import { Html } from "@react-email/html";
import { Heading, Preview, Text, Tailwind, Section, Body, Link, Head } from "@react-email/components";

interface VerificationTemplateProps {
	domain: string;
	token:  string;
}

export function VerificationTemplate({ domain, token } : VerificationTemplateProps) {
	const verificationLink = `${domain}/account/verify?token=${token}`;

	return (
		<Html>
			<Head />
			<Preview>Account Verification</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>Your Email Verificating</Heading>
						
						<Text className='text-base text-black'>Thanks for your regisration on Twitch! For verification of your email, please click on this button below:</Text>
						<Link href={verificationLink} className='inline-flex justify-center items-center rounded-md text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
							Verify Email
						</Link>
					</Section>

					<Section className='text-center mt-8'>
						<Text className='text-gray-600'>
							If you have questions or some troubles please ask it to our support team here: {' '}
							<Link
								href='mailto:'
								className='text-[#18B9AE] underline'
							>{}{}Should be link here{}{}</Link>
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}