const DB=require('../models/Ticket')
const Payment=require("../models/PurchaseTickets")
const User=require("../models/UserDetals")
const nodemailer = require('nodemailer')
require('dotenv').config()
exports.AddTickets = async (req,res) => {
    try {
      const ticketData = req.body; // Assuming req.body is an array of ticket objects
      const data=[]  
       for (let i = 0; i < ticketData.length; i++) { 
           var info= await DB.create(ticketData[i]);
           data.push(info)
        }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  
  exports.getWonTickets = async (req, res) => {
    try {
        const { no, id } = req.body;

        // Step 1: Find all tickets with RaffleId equal to id
        const tickets = await DB.find({ RaffleId: id });

        // Step 2: Extract the _id values from the tickets
        const ticketIds = tickets.map(ticket => ticket._id);

        // Step 3: Find all payments with TicketID equal to ticketIds
        const payments = await Payment.find({ TicketID: { $in: ticketIds } });

        // Step 4: Randomly select 'no' unique payments from the payments array
        const selectedPayments = [];
        const unselectedPayments = [];
        const selectedTicketIds = []; // Array to store selected TicketIDs

        while (selectedPayments.length < no && payments.length > 0) {
            const randomIndex = Math.floor(Math.random() * payments.length);
            const randomPayment = payments.splice(randomIndex, 1)[0]; // Remove the selected payment from the array
            selectedPayments.push(randomPayment);
            selectedTicketIds.push(randomPayment.TicketID); // Extract and store the TicketID
        }

        // Step 5: Any remaining payments in 'payments' are unselected
        unselectedPayments.push(...payments);

        // Step 6: Update the WinStatuses of selectedPayments to "won"
        for (const payment of selectedPayments) {
            payment.WinStatuses = "won";
            await payment.save(); // Save the updated payment
        }

        // Step 7: Update the WinStatuses of unselectedPayments to "loss"
        for (const payment of unselectedPayments) {
            payment.WinStatuses = "loss";
            await payment.save(); // Save the updated payment
        }

        // Step 8: Now 'selectedPayments' contains 'no' unique randomly selected payments
        // 'unselectedPayments' contains any remaining unselected payments
        // 'selectedTicketIds' contains the TicketIDs of selected payments

        // Step 9: Find and send the tickets whose _id matches each value in selectedTicketIds
        const selectedTickets = await Promise.all(
            selectedTicketIds.map(async (ticketId) => {
                return await DB.findOne({ _id: ticketId });
            })
        );
// Step 10: Extract UserID and TicketID for selected and unselected payments
const selectedPaymentData = selectedPayments.map(payment => ({
    UserID: payment.UserID,
    TicketID: payment.TicketID,
}));
const unselectedPaymentData = unselectedPayments.map(payment => ({
    UserID: payment.UserID,
    TicketID: payment.TicketID,
}));

// Step 11: Search for users and tickets based on extracted UserID and TicketID
const selectedUserPromises = selectedPaymentData.map(data => User.findOne({ _id: data.UserID }));
const selectedTicketPromises = selectedPaymentData.map(data => DB.findOne({ _id: data.TicketID }));

const selectedUsers = await Promise.all(selectedUserPromises);
const selectedTicketsForUsers = await Promise.all(selectedTicketPromises);

// Combine user and ticket data for selected payments
const selectedPaymentWithData = selectedPaymentData.map((data, index) => ({
    ...data,
    User: selectedUsers[index],
    Ticket: selectedTicketsForUsers[index],
}));
 // Step 12: Extract UserID and TicketID for unselected payments
 const unselectedUserPromises = unselectedPaymentData.map(data => User.findOne({ _id: data.UserID }));
 const unselectedTicketPromises = unselectedPaymentData.map(data => DB.findOne({ _id: data.TicketID }));

 const unselectedUsers = await Promise.all(unselectedUserPromises);
 const unselectedTicketsForUsers = await Promise.all(unselectedTicketPromises);

 // Combine user and ticket data for unselected payments
 const unselectedPaymentWithData = unselectedPaymentData.map((data, index) => ({
     ...data,
     User: unselectedUsers[index],
     Ticket: unselectedTicketsForUsers[index],
 }));
  // Step 13: Call a function for each object in unselectedPaymentWithData
  selectedPaymentWithData.forEach((paymentData) => {
    // Extract relevant data
    const { User, Ticket } = paymentData;

    // Call your function with the specified parameters
    sendWenMail(User.UserName, User.UserEmail, Ticket.Title, Ticket.TicketNo);
});
 // Step 13: Call a function for each object in unselectedPaymentWithData
 unselectedPaymentWithData.forEach((paymentData) => {
    // Extract relevant data
    const { User, Ticket } = paymentData;

    // Call your function with the specified parameters
    Sendbadmail(User.UserName, User.UserEmail, Ticket.Title, Ticket.TicketNo);
});
 res.status(200).json({
     selectedPayments,
     unselectedPayments,
     selectedTickets,
     selectedPaymentData,
     unselectedPaymentData,
     selectedPaymentWithData,
     unselectedPaymentWithData,
 });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

function sendWenMail(x,y,z,w){
    let html =`
    <!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
        <style>
            * {
                box-sizing: border-box;
            }
    
            body {
                margin: 0;
                padding: 0;
            }
    
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
            }
    
            #MessageViewBody a {
                color: inherit;
                text-decoration: none;
            }
    
            p {
                line-height: inherit
            }
    
            .desktop_hide,
            .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
            }
    
            .image_block img+div {
                display: none;
            }
    
            @media (max-width:620px) {
                .desktop_hide table.icons-inner {
                    display: inline-block !important;
                }
    
                .icons-inner {
                    text-align: center;
                }
    
                .icons-inner td {
                    margin: 0 auto;
                }
    
                .mobile_hide {
                    display: none;
                }
    
                .row-content {
                    width: 100% !important;
                }
    
                .stack .column {
                    width: 100%;
                    display: block;
                }
    
                .mobile_hide {
                    min-height: 0;
                    max-height: 0;
                    max-width: 0;
                    overflow: hidden;
                    font-size: 0px;
                }
    
                .desktop_hide,
                .desktop_hide table {
                    display: table !important;
                    max-height: none !important;
                }
    
                .row-1 .column-1 .block-2.paragraph_block td.pad>div,
                .row-1 .column-1 .block-5.paragraph_block td.pad>div,
                .row-1 .column-1 .block-6.paragraph_block td.pad>div {
                    font-size: 14px !important;
                }
    
                .row-1 .column-1 .block-1.heading_block h3 {
                    font-size: 15px !important;
                }
    
                .row-1 .column-1 .block-4.list_block ul {
                    font-size: 12px !important;
                    line-height: auto !important;
                }
            }
        </style>
    </head>
    
    <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;">
            <tbody>
                <tr>
                    <td>
                        <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad">
                                                                    <h3 style="margin: 0; color: #222222; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Dear ${x}</span></h3>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:35px;padding-left:10px;padding-right:10px;padding-top:30px;">
                                                                    <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:1px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                                        <p style="margin: 0;">We hope this message finds you well. We are thrilled to inform you that you are one of the lucky winners of the recent Raffle! Congratulations on your exciting win!&nbsp;</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table class="heading_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad">
                                                                    <h1 style="margin: 0; color: #222222; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Details:</strong><span class="tinyMce-placeholder"></span></h1>
                                                                </td>
                                                            </tr>
                                                        </table><!--[if mso]><style>#list-r0c0m3 ul{margin: 0 !important; padding: 0 !important;} #list-r0c0m3 ul li{mso-special-format: bullet;}#list-r0c0m3 .levelOne li {margin-top: 0 !important;} #list-r0c0m3 .levelOne {margin-left: -20px !important;}#list-r0c0m3 .levelTwo li {margin-top: 0 !important;} #list-r0c0m3 .levelTwo {margin-left: 10px !important;}#list-r0c0m3 .levelThree li {margin-top: 0 !important;} #list-r0c0m3 .levelThree {margin-left: 40px !important;}</style><![endif]-->
                                                        <table class="list_block block-4" id="list-r0c0m3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:30px;padding-left:10px;padding-right:10px;padding-top:30px;">
                                                                    <div class="levelOne" style="margin-left: 0;">
                                                                        <ul class="leftList" start="1" style="margin-top: 0; margin-bottom: 0; padding: 0; padding-left: 20px; font-weight: 400; text-align: left; color: #101112; direction: ltr; font-family: Arial,Helvetica,sans-serif; font-size: 16px; letter-spacing: 0; line-height: 120%; mso-line-height-alt: 19.2px; list-style-type: disc;">
                                                                            <li style="margin-bottom: 0; text-align: left;">Raffle Name:<strong> ${z}</strong></li>
                                                                            <li style="margin-bottom: 0; text-align: left;">Ticket Number:<strong> ${w}</strong></li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table class="paragraph_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad">
                                                                    <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:1px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                                        <p style="margin: 0;">Your participation has resulted in this fantastic victory, and we are delighted to have you as one of our winners. Your dedication to our community is truly appreciated. To claim your prize and receive further instructions on how to do so, please contact our dedicated support team by repling this mail. They are here to assist you with the next steps and ensure a smooth process.</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table class="paragraph_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad">
                                                                    <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                                        <p style="margin: 0; margin-bottom: 16px;">Once again, congratulations on your win, and thank you for being an essential part of our community.</p>
                                                                        <p style="margin: 0; margin-bottom: 16px;">Warm regards,</p>
                                                                        <p style="margin: 0;"><strong>MBI</strong></p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="font-weight: 400; text-align: left; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                <!--[if !vml]><!-->
                                                                                <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                                                                                    <tr>
                                                                                        <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="http://designedwithbeefree.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Beefree Logo" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                                                        <td style="font-family: 'Inter', sans-serif; font-size: 15px; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="http://designedwithbeefree.com/" target="_blank" style="color: #1e0e4b; text-decoration: none;">Designed with Beefree</a></td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table><!-- End -->
    </body>
    
    </html>
		`
        const APIKEY=process.env.EMAIL_AIP_KEY
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user : "rofako82@gmail.com",
				pass: APIKEY
			}
		})
		const message = {
				from: 'rofako82@gmail.com', // sender address
				to:y, // list of receivers
				subject: "MBI ticket decline", // Subject line
				html:html, 
			}
            transporter.sendMail(message,()=>{

            })
}

function Sendbadmail(x,y,z,w){
    let html =`
    <!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
        <style>
            * {
                box-sizing: border-box;
            }
    
            body {
                margin: 0;
                padding: 0;
            }
    
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
            }
    
            #MessageViewBody a {
                color: inherit;
                text-decoration: none;
            }
    
            p {
                line-height: inherit
            }
    
            .desktop_hide,
            .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
            }
    
            .image_block img+div {
                display: none;
            }
    
            @media (max-width:620px) {
                .desktop_hide table.icons-inner {
                    display: inline-block !important;
                }
    
                .icons-inner {
                    text-align: center;
                }
    
                .icons-inner td {
                    margin: 0 auto;
                }
    
                .mobile_hide {
                    display: none;
                }
    
                .row-content {
                    width: 100% !important;
                }
    
                .stack .column {
                    width: 100%;
                    display: block;
                }
    
                .mobile_hide {
                    min-height: 0;
                    max-height: 0;
                    max-width: 0;
                    overflow: hidden;
                    font-size: 0px;
                }
    
                .desktop_hide,
                .desktop_hide table {
                    display: table !important;
                    max-height: none !important;
                }
    
                .row-1 .column-1 .block-1.heading_block h3 {
                    font-size: 15px !important;
                }
    
                .row-1 .column-1 .block-2.paragraph_block td.pad>div {
                    font-size: 14px !important;
                }
            }
        </style>
    </head>
    
    <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;">
            <tbody>
                <tr>
                    <td>
                        <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad">
                                                                    <h3 style="margin: 0; color: #222222; direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Dear ${x}</span></h3>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                            <tr>
                                                                <td class="pad" style="padding-bottom:35px;padding-left:10px;padding-right:10px;padding-top:30px;">
                                                                    <div style="color:#101112;direction:ltr;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:1px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                                        <p style="margin: 0; margin-bottom: 17px;">We hope this message finds you well. We want to extend our heartfelt thanks for your participation in the recent Raffle (${z}). While your ticket (${w})&nbsp;did not win this time, your support is invaluable to our community.</p>
                                                                        <p style="margin: 0; margin-bottom: 17px;">We appreciate your dedication and hope you will continue to join our future events for more opportunities. If you have any questions or need assistance with anything, please don't hesitate to reach out to our support team by replying this mail. They are here to assist you in any way they can.</p>
                                                                        <p style="margin: 0; margin-bottom: 17px;">Thank you for being an essential part of our community, and we look forward to having you with us in future events.</p>
                                                                        <p style="margin: 0; margin-bottom: 17px;">Warm regards,</p>
                                                                        <p style="margin: 0;">MBI</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
                            <tbody>
                                <tr>
                                    <td>
                                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 600px; margin: 0 auto;" width="600">
                                            <tbody>
                                                <tr>
                                                    <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                        <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                            <tr>
                                                                <td class="pad" style="vertical-align: middle; color: #1e0e4b; font-family: 'Inter', sans-serif; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                        <tr>
                                                                            <td class="alignment" style="vertical-align: middle; text-align: center;"><!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                <!--[if !vml]><!-->
                                                                                <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation"><!--<![endif]-->
                                                                                    <tr>
                                                                                        <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="http://designedwithbeefree.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Beefree Logo" src="https://d1oco4z2z1fhwp.cloudfront.net/assets/Beefree-logo.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                                                        <td style="font-family: 'Inter', sans-serif; font-size: 15px; color: #1e0e4b; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="http://designedwithbeefree.com/" target="_blank" style="color: #1e0e4b; text-decoration: none;">Designed with Beefree</a></td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table><!-- End -->
    </body>
    
    </html>
		`
        const APIKEY=process.env.EMAIL_AIP_KEY
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user : "rofako82@gmail.com",
				pass: APIKEY
			}
		})
		const message = {
				from: 'rofako82@gmail.com', // sender address
				to:y, // list of receivers
				subject: "MBI ticket decline", // Subject line
				html:html, 
			}
            transporter.sendMail(message,()=>{

            })
}
exports.GetAllTicket= async(req,res)=>{
    try {
        
       const data=await DB.find({})
        
       res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}



exports.GetSingleTicket= async (req,res)=>{
    try {
        const{id}=req.params
        const data=await DB.findById(id)
        
        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}


exports.UpdateSingleTicket=async (req,res)=>{
    try {
        

        const{id}=req.params
        const data=await DB.findByIdAndUpdate(id,req.body)
        
        res.status(200).json(data)


    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}


exports.DeleteSingleTicket= async(req,res)=>{
    try {
        

        const{id}=req.params
        const data=await DB.findByIdAndDelete(id)
        
        res.status(200).json(data)


    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}