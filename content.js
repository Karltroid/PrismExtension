import fs from "fs"

window.addEventListener('load', function() {
  // Find the target element where the button should be placed
  var targetElement = document.getElementById('ContentPlaceHolder1_btnCancelTop');

  if (targetElement) {
    // Create a new button element
    var button = document.createElement('button');
    button.innerText = 'Create Job Sheet';
    button.id = 'myInjectedButton';

    // Insert the button after the target element
    targetElement.parentNode.insertBefore(button, targetElement.nextSibling);

    // Add an event listener for button click
    button.addEventListener('click', function() {
      getJobData();
    });
  }
});

async function createPdf(job) {
  //const formUrl = 'https://pdf-lib.js.org/assets/dod_character.pdf'
  //const pdfData = await fetch(formUrl).then(res => res.arrayBuffer())

  // const marioUrl = 'https://pdf-lib.js.org/assets/small_mario.png'
  // const marioImageBytes = await fetch(marioUrl).then(res => res.arrayBuffer())

  // const emblemUrl = 'https://pdf-lib.js.org/assets/mario_emblem.png'
  // const emblemImageBytes = await fetch(emblemUrl).then(res => res.arrayBuffer())

  const fs = require('fs/promises'); //note fs/promises, not fs here
  const pdfData = await fs.readFile('./PrismJobCoverSheet.pdf');
  const pdfDoc = await PDFLib.PDFDocument.load(pdfData)

  // const marioImage = await pdfDoc.embedPng(marioImageBytes)
  // const emblemImage = await pdfDoc.embedPng(emblemImageBytes)

  const form = pdfDoc.getForm()

  // const nameField = form.getTextField('CharacterName 2')
  // const ageField = form.getTextField('Age')
  // const heightField = form.getTextField('Height')
  // const weightField = form.getTextField('Weight')
  // const eyesField = form.getTextField('Eyes')
  // const skinField = form.getTextField('Skin')
  // const hairField = form.getTextField('Hair')

  // const alliesField = form.getTextField('Allies')
  // const factionField = form.getTextField('FactionName')
  // const backstoryField = form.getTextField('Backstory')
  // const traitsField = form.getTextField('Feat+Traits')
  // const treasureField = form.getTextField('Treasure')

  // const characterImageField = form.getButton('CHARACTER IMAGE')
  // const factionImageField = form.getButton('Faction Symbol Image')

  // nameField.setText('Mario')
  // ageField.setText('24 years')
  // heightField.setText(`5' 1"`)
  // weightField.setText('196 lbs')
  // eyesField.setText('blue')
  // skinField.setText('white')
  // hairField.setText('brown')

  // characterImageField.setImage(marioImage)

  // alliesField.setText(
  //   [
  //     `Allies:`,
  //     `  • Princess Daisy`,
  //     `  • Princess Peach`,
  //     `  • Rosalina`,
  //     `  • Geno`,
  //     `  • Luigi`,
  //     `  • Donkey Kong`,
  //     `  • Yoshi`,
  //     `  • Diddy Kong`,
  //     ``,
  //     `Organizations:`,
  //     `  • Italian Plumbers Association`,
  //   ].join('\n'),
  // )

  // factionField.setText(`Mario's Emblem`)

  // factionImageField.setImage(emblemImage)

  // backstoryField.setText(
  //   [
  //     `Mario is a fictional character in the Mario video game franchise, `,
  //     `owned by Nintendo and created by Japanese video game designer Shigeru `,
  //     `Miyamoto. Serving as the company's mascot and the eponymous `,
  //     `protagonist of the series, Mario has appeared in over 200 video games `,
  //     `since his creation. Depicted as a short, pudgy, Italian plumber who `,
  //     `resides in the Mushroom Kingdom, his adventures generally center `,
  //     `upon rescuing Princess Peach from the Koopa villain Bowser. His `,
  //     `younger brother and sidekick is Luigi.`,
  //   ].join('\n'),
  // )

  // traitsField.setText(
  //   [
  //     `Mario can use three basic three power-ups:`,
  //     `  • the Super Mushroom, which causes Mario to grow larger`,
  //     `  • the Fire Flower, which allows Mario to throw fireballs`,
  //     `  • the Starman, which gives Mario temporary invincibility`,
  //   ].join('\n'),
  // )

  // treasureField.setText(['• Gold coins', '• Treasure chests'].join('\n'))

  const pdfDataUri = await pdfDoc.saveAsBase64({dataUri: true});
  const blob = base64toBlob(pdfDataUri);
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');

}

// async function createPdf(job) {
//   const pdfDoc = await PDFLib.PDFDocument.create();
//   const page = pdfDoc.addPage([350, 400]);
//   page.moveTo(110, 200);
//   page.drawText(job.name);
//   const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  
//   // Create blob URL from base64 PDF data
//   const blob = base64toBlob(pdfDataUri);
//   const blobUrl = URL.createObjectURL(blob);

//   // Open PDF in a new window
//   window.open(blobUrl, '_blank');
// }

function base64toBlob(base64Data) {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'application/pdf' });
}

function getJobData() {
  var job = new Job();
  createPdf(job);
}

function getInputValue(elementID) {
  var inputElement = document.getElementById(elementID);

  if (inputElement) {
    return inputElement.value;
  }

  return "";
}

function getSelectOptionValue(elementID) {
  var selectOptionElement = document.getElementById(elementID);

  if (selectOptionElement) {
    return selectOptionElement.options[selectOptionElement.selectedIndex].textContent;
  }

  return "";
}


class Job {
  constructor() {
    this.name = getInputValue('ContentPlaceHolder1_frmJob_txtJobLNameInsured');
    this.lossType = getSelectOptionValue('ContentPlaceHolder1_frmJob_ddlLossTypeID');
    this.lossCategory = getSelectOptionValue('ContentPlaceHolder1_frmJob_ddlCategoryTypeID');
    this.insured = new Insured();
  }
}

class Insured {
  constructor() {
    this.firstName = getInputValue('ContentPlaceHolder1_frmJob_txtFirstName');
    this.lastName = getInputValue('ContentPlaceHolder1_frmJob_txtLastName');
    this.address1 = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredAddress1');
    this.address2 = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredAddress2');
    this.city = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredCity');
    this.state = getSelectOptionValue('ContentPlaceHolder1_frmJob_ddlJobNameInsuredState');
    this.zipCode = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredZipCode');
    this.phoneExt = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredExt');
    this.mainPhone = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredPhoneWork');
    this.homePhone = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredPhoneHome');
    this.mobilePhone = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredPhoneMobile');
    this.email = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredEmail');
  }
}