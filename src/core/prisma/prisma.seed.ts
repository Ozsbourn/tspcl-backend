import { Prisma, PrismaClient } from "@/prisma/generated";
import { BadRequestException, Logger } from "@nestjs/common";
import { hash } from "argon2";

const prisma = new PrismaClient({
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
	},
});

async function main() {
	try {
		Logger.log("DB seed attemption on process...");
		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.category.deleteMany(),
		]);

		const categoriesData = [
			{
				title: "Test",
				slug: "testcat",
				description: "Lorem ipsum dolor amet",
				thumbnailUrl: "categories/test.webp",
			},
		];

		await prisma.category.createMany({
			data: categoriesData,
		});
		Logger.log("Categories succesfully created at DB");

		const categories = await prisma.category.findMany();
		const categoriesBySlug = Object.fromEntries(
			categories.map((category) => [category.slug, category])
		);

		const streamTitles = {
			testcat: ["Test name for test category"],
		};
		const usernames = [
			"tinklediscussion",
			"sizzlebonus",
			"miaowguy",
			"chucklepromotion",
			"cuckoovillage",
			"yikesbeginning",
			"chortlepension",
			"splatdrama",
			"murmerinspection",
			"snarlrecording",
			"clattercourage",
			"thudemphasis",
			"gurglehousing",
			"tweetleadership",
			"parphighway",
			"fizzcharacter",
			"sniffestate",
			"murmuralarm",
			"belchcamp",
			"ribbitcommercial",
			"squawkresort",
			"shushson",
			"howlweakness",
			"sploshpossession",
			"growlessay",
			"thumpdisaster",
			"hiccupcourt",
			"flutterrelief",
			"guffawgarage",
			"squeaksentence",
			"snufflecancel",
			"splatterkid",
			"woofinterview",
			"blurtequivalent",
			"zoomseason",
			"twangshine",
			"snapuncle",
			"bongimplement",
			"gruntreason",
			"boomincome",
			"glugindividual",
			"ughpolitics",
			"buzzanywhere",
			"cackleregion",
			"cracklegrocery",
			"kerchingclue",
			"barkrestaurant",
			"booinspector",
			"creaktone",
			"bamtonight",
		];

		await prisma.$transaction(async (tx) => {
			for (const username of usernames) {
				const randomCategory =
					categoriesBySlug[
						Object.keys(categoriesBySlug)[
							Math.floor(
								Math.random() *
									Object.keys(categoriesBySlug).length
							)
						]
					];

				const userExists = await tx.user.findUnique({
					where: {
						username,
					},
				});
				if (!userExists) {
					const user = await tx.user.create({
						data: {
							email: `${username}@streplat.ru`,
							password: await hash("1234567890"),
							username,
							displayName: username,
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							isTotpEnabled: false,
							socialLinks: {
								createMany: {
									data: [
										{
											title: "Telegram",
											url: `https://t.me/${username}`,
											position: 1,
										},
										{
											title: "YouTube",
											url: `https://youtube.com/@${username}`,
											position: 2,
										},
									],
								},
							},
						},
					});
					const randomTitles = streamTitles[randomCategory.slug];
					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						];

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl: `/streams/${user.username}.webp`,
							user: {
								connect: {
									id: user.id,
								},
							},
							category: {
								connect: {
									id: randomCategory.id,
								},
							},
						},
					});
					Logger.log(
						`User "${user.username}" and his stream created.`
					);
				}
			}
		});

		Logger.log(`DB seeding completed`);
	} catch (err) {
		Logger.error(err);
		throw new BadRequestException("Error during database seed attemption");
	} finally {
		Logger.log("DB connection closing...");
		await prisma.$disconnect();
		Logger.log("DB connection succesfully closed");
	}
}

main();
