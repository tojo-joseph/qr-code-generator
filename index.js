/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
  .prompt([
    {
      type: "input",
      name: "link",
      message: "Enter the link to generate a QR code:",
      validate: (input) => (input ? true : "Link cannot be empty!"),
    },
  ])
  .then((answers) => {
    const link = answers.link;

    // Generate a unique file name for each QR code
    const timestamp = Date.now();
    const qrCodeFilePath = `./qrcodes/generated_qrcode_${timestamp}.png`;

    // Ensure the 'qrcodes' directory exists
    fs.mkdirSync("./qrcodes", { recursive: true });

    // Generate and save the QR code
    const qrCodeImage = qr.image(link, { type: "png" });
    const qrCodeStream = fs.createWriteStream(qrCodeFilePath);

    qrCodeImage.pipe(qrCodeStream);

    qrCodeStream.on("finish", () => {
      console.log(`QR code saved to: ${qrCodeFilePath}`);
    });

    qrCodeStream.on("error", (err) => {
      console.error("Failed to save QR code:", err);
    });
  })
  .catch((error) => {
    console.error("Error during input:", error);
  });
