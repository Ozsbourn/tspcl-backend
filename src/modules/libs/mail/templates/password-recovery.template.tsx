import { SessionMetadata } from "@/src/shared/types/session-metadata.types";
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";
import * as React from "react";

interface PasswordRecoveryTemplateProps {
	domain: string;
	token: string;
	metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({ domain, token, metadata } : PasswordRecoveryTemplateProps) {
	const resetLink = `${domain}/account/recovery/${token}`;

	return (
		<Html>
			<Head />
			<Preview>Password Reset</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading className='text-3xl text-black font-bold'>Yoor password reset</Heading>
						
						<Text className='text-base text-black mt-2'>You requested resetting of your password.</Text>
						<Text className='text-base text-black mt-2'>For creating new password, please, click on button below:</Text>
						<Link href={resetLink} className='inline-flex justify-center items-center rounded-md text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
							Reset Password
						</Link>
					</Section>

					<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
						<Heading className='text-xl font-semibold text-[#18B9AE]'>Request info:</Heading>
						<ul className="list-disc list-inside text-black mt-2">
							<li>Location: {metadata.location.country}, {metadata.location.city}</li>
							<li>OS: {metadata.device.os}</li>
							<li>Browser: {metadata.device.browser}</li>
							<li>IP-adress: {metadata.ip}</li>
						</ul>

						<Text className='text-gray-600 mt-2'>If you didn't request reset of your password, please, ignore this email.</Text>
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