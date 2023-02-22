const nodemailer=require('nodemailer');
const pug=require('pug');
const htmlToText = require('html-to-text');
// await new sendmail(postss, url).sendWelcome();

module.exports=class Email{
    constructor(user,url){
        this.to=user.email;
        this.FirstName=user.name.split(' ')[0];
        this.url=url;
        this.from="my vinay kumar<vinayk1131@gmail.com>"
    }
    newTransport(){
        if(process.env.Node_ENV==='roduction'){
        return nodemailer.createTransport({
            service:"SendGrid",
            auth:{
                user:"apikey",
                pass:process.env.Sendgridket
            }

        })
        }
        return nodemailer.createTransport({
            host:process.env.Host,
            port:process.env.ports,
            auth:{
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    
    async send(template,subject){
        const html=pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            FirstName:this.FirstName,
            url:this.url,
            subject
        })
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
          };
        await this.newTransport().sendMail(mailOptions);
    }
        async sendWelcome(){
            await this.send("Welcome","Welcome to our new Family");   
    }
    async sendPasswordReset() {
        await this.send(
          'passwordReset',
          'Your password reset token (valid for only 10 minutes)'
        );
      }
}
