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
  // load job cover sheet pdf
  const formUrl = 'https://raw.githubusercontent.com/Karltroid/PrismExtension/main/PrismJobCoverSheet.pdf'
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
  const pdfDoc = await PDFLib.PDFDocument.load(formPdfBytes)
  const form = pdfDoc.getForm()

  // modify pdf with job info

  // top bar
  const jobNumber = form.getTextField('Job')
  jobNumber.setText(job.number);
  const jobName = form.getTextField('Name')
  jobName.setText(job.insured.lastName);
  const jobReceived = form.getTextField('Received')
  jobReceived.setText(job.createdDate);
  const jobCarrier = form.getTextField('Carrier')
  jobCarrier.setText(job.carrier);

  // carrier/adjuster info box
  const carrierName = form.getTextField('Name_2')
  carrierName.setText(job.carrier);

  // insured box
  const insuredName = form.getTextField('Name_3')
  insuredName.setText(job.insured.firstName + " " + job.insured.lastName);
  const insuredAddress = form.getTextField('Address')
  insuredAddress.setText(job.insured.address1 + " " + job.insured.address2);
  const insuredCityStateZip = form.getTextField('City state Zip')
  insuredCityStateZip.setText(job.insured.city + ", " + getStateAbbreviation(job.insured.state) + " " + job.insured.zipCode);
  const insuredPhoneNumber = form.getTextField('Phone_2')
  insuredPhoneNumber.setText(job.insured.phoneExt + job.insured.mainPhone);
  const insuredMobilePhoneNumber = form.getTextField('Mobile')
  insuredMobilePhoneNumber.setText(job.insured.mobilePhone);
  const insuredEmail = form.getTextField('Email_2')
  insuredEmail.setText(job.insured.email);

  if (job.lossType.includes("Smoke") || job.lossType.includes("Soot")) {
    form.getCheckBox('Check Box12').check();
  }
  if (job.lossType.includes("Puff Back")) {
    form.getCheckBox('Check Box13').check();
  }
  if (job.lossType.includes("Water") || job.lossType.includes("Sewer")) {
    form.getCheckBox('Check Box15').check();
  }
  if (job.lossType.includes("Lightning") || job.lossType.includes("Surge")) {
    form.getCheckBox('Check Box14').check();
  }
  

  // create and load pdf url
  const pdfDataUri = await pdfDoc.saveAsBase64({dataUri: true});
  const blob = base64toBlob(pdfDataUri);
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');

}

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

function getRawValue(elementID) {
  var inputElement = document.getElementById(elementID);

  if (inputElement) {
    return inputElement.textContent;
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
    this.fullNumber = getRawValue('ContentPlaceHolder1_frmJob_vlblDisplayJobNumber');
    this.number = getRawValue('ContentPlaceHolder1_frmJob_vlblDisplayJobNumber').slice(-4);
    this.carrier = getInputValue('ContentPlaceHolder1_frmJob_txtJobLNameInsured').split(" / ")[1];
    this.createdDate = extractDate(getRawValue('ContentPlaceHolder1_frmJob_lblCreated'));
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
    this.state = getSelectOptionValue('ContentPlaceHolder1_frmJob_ddlJobNameInsuredState').replace(/\s/g, '');
    this.zipCode = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredZipCode');
    this.phoneExt = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredExt');
    this.mainPhone = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredPhoneWork');
    this.homePhone = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredPhoneHome');
    this.mobilePhone = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredPhoneMobile');
    this.email = getInputValue('ContentPlaceHolder1_frmJob_txtJobNameInsuredEmail');
  }
}

function getStateAbbreviation(statename) {
  switch (statename) {
    case "MASSACHUSETTS":
      return "MA"
    case "NEWHAMPSHIRE":
      return "NH"
    case "MAINE":
      return "ME"
    case "VERMONT":
      return "VT"
    case "CONNECTICUT":
      return "CT"
    case "NEWYORK":
      return "NY"
    case "PENNSYLVANIA":
      return "PA"
    case "RHODEISLAND":
      return "RI"
    case "NEWJERSEY":
      return "NJ"
    default:
      return ""
  }
}

function extractDate(inputString) {
    // Regular expression to match the date and time part
    const dateTimeRegex = /Created:\s(\d{1,2}\/\d{1,2})\/(\d{4})\s\d{1,2}:\d{2}:\d{2}\s(?:AM|PM)/;

    // Extract the date part
    const match = inputString.match(dateTimeRegex);
    if (match) {
        const datePart = match[1];
        const yearPart = match[2].slice(-2); // Get the last two digits of the year
        return `${datePart}/${yearPart}`;
    } else {
        return null; // Return null if the input doesn't match the expected format
    }
}