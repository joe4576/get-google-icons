import fetch from "node-fetch";
import fs from "fs";

const URL =
  "https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true";

async function getIconNames() {
  const response = await fetch(URL);
  const parsedData = JSON.parse(
    (await response.text()).split("\n").slice(1).join("\n")
  );
  return parsedData.icons
    .filter((_, index) => index % 2 === 0)
    .map((icon) => icon.name);
}

async function writeIconNamesToFile(filePath, fileName) {
  const iconNames = await getIconNames();

  const linesToWrite = [
    "export default class Icons {",
    ...iconNames.map(
      (name) => `static get icon_${name}() { return "${name}" }`
    ),
    "}",
  ];

  if (!fs.existsSync(filePath)) {
    await fs.promises.mkdir(filePath);
  }

  await fs.promises.writeFile(
    filePath + fileName,
    linesToWrite.join("\n"),
    (err) => {
      console.log(`Error writing to file: ${err}`);
    }
  );

  console.log(`${iconNames.length} icon names written to file.`);
}

writeIconNamesToFile("./dist/", "icons.ts");
