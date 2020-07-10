const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_APIKEY);


  const sendWelcomeEmail = (email,name ) => {
    console.log('Email = ' + user.email)
  sgMail.send({
    to: email,
    from: 'salil.sahu@thermofisher.com',
    subject: 'welcome to tatanagar.net',
    text: `Welcome ${name} to our site.Here you will explore your childhood memories`,
    // html: '<strong>here is html part of the email</strong>',
  }).catch((e) =>{
      console.log(e)
  })
  }


  const sendCancellationEmail = (email,name ) => {
    console.log('Email = ' + user.email)
  sgMail.send({
    to: email,
    from: 'salil.sahu@thermofisher.com',
    subject: 'Sorry to see you go ',
    text: `Dear ${name} let us know if we could have done otherwise`
  }).catch((e) =>{
      console.log(e)
  })
  }

  module.exports = {
      sendWelcomeEmail,
      sendCancellationEmail
  }