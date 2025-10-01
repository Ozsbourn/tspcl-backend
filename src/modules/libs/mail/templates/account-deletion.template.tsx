import {
	Body,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

export function AccountDeletionTemplate() {
	return (
		<Html>
			<Head />
			<Preview>Account Deleted</Preview>
			<Tailwind>
				<Body className="max-w-2xl mx-auto p-6 bg-slate-50">
					<Section className="text-center">
						<Heading className="text-3xl text-black font-bold">
							Your account was deleted
						</Heading>

						<Text className="text-base text-black mt-2">
							Your account was completely deleted from our
							database. All your data was erased with no way to
							restoration.
						</Text>
					</Section>

					<Section className="bg-white text-black text-center rounded-lg shadow-dm p-6 mb-4">
						<Text>
							You will not to get notifications at Telegram and by
							email.
						</Text>
						<Text>
							If you will want to return on Streplat, you should
							be register again.
						</Text>
					</Section>

					<Section className="text-center text-black">
						<Text>
							Thank you for been a while with us! We always would
							be glad to see you on our platform.
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}
