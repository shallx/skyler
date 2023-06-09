const program = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const { getTiktokVideoDownloadUrl, dlVideo } = require("../api");
const Listr = require("listr");

const description = `
    Download media from various platforms
    examples: 1. skyler download -t <tiktok url>
              Action: Fetches download url and downloads it
              2. skyler download -i <instagram url>
              Action: Fetches download url and downloads it
`

program
  .command("download")
  .option("-t, --tiktok <url>", "Download tiktok videos")
  .option("-i, --instagram <url>", "Download instagram videos")
  .description(description)
  .action(async (command) => {
    if (command.tiktok) {
      const result = await dlTiktokVideo(command.tiktok);

      process.exit();
    } else {
      console.log(
        chalk.bold.red("✗") + " Please provide a flat option to indicate source"
      );
    }
  });

const dlTiktokVideo = async (url) => {
  const tasks = new Listr([]);
  tasks.add({
    title: "Generating Download Link",
    task: async (ctx, task) => {
      await getTiktokVideoDownloadUrl(url)
        .then((res) => {
          return (ctx.downloadLink = res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  tasks.add({
    title: "Downloading Video",
    skip: (ctx) => !ctx.downloadLink && "Download link not found",
    task: async (ctx, task) => {
      await dlVideo(ctx.downloadLink)
        .then((res) => {
          console.log(chalk.bold.green("✓") + " Download Successful!");
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  await tasks.run().catch((err) => {
    console.log(err);
  });
  process.exit();
};
