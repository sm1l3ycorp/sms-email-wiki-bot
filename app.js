// WIKIPEDIA eMail/SMS NodeJS Bot
// Miles Leach - 2019
// Send the SMS to inbox in this format: emailAddress (wiki search term)
const notifier = require('mail-notifier');
const nodemailer = require('nodemailer');
const axios = require('axios');
const config = require('./config');

const imap = {
  user: config.user,
  password: config.pw,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

const n = notifier(imap);
n.on('end', () => n.start())
    .on('mail', mail => { 
        if (mail.subject.includes('wiki')) {
          const wikiSearch = mail.subject.replace('wiki', '');
          wikiQuery(wikiSearch);
        }
    })
  .start();

const doIt = (emailData) => {
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: config.user,
      pass: config.pw
  }
});

const mailOptions = {
  from: config.user,
  to: config.to,
  subject: 'Wiki Bot',
  text: emailData.toString(),
  html: emailData.toString()
};

transporter.sendMail(mailOptions, function(error, info){
  if (error){
      return console.log(error);
  }
  console.log('Message sent: ' + info.response);
});
}

 async function wikiQuery(query) {
  const queryURL = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=1&format=json`;
    try {
      const response = await axios.get(queryURL);
      doIt(response.data[2]);
    } catch (error) {
      console.error(error);
    }
}
