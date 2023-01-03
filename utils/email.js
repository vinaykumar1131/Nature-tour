const nodemailer=require('nodemailer');
const sendmail=async option=>{
    const transport=nodemailer.createTransport({
        host:process.env.Host,
        port:process.env.ports,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailoptions={
        from:"my vinay kumar<vinayk1131@gmail.com>",
        to: option.email,
        subject:option.subject,
        text: option.message
    }
    await transport.sendMail(mailoptions);
}
module.exports=sendmail;
