const Mail = use('Mail');

class UserResendActive {
  static get key() {
    return 'UserResendActive-key';
  }

  async handle(job) {
    const { data } = job; // the 'data' variable has user data
    console.log(data);
    await Mail.send(
      'emails.auth.resend-active',
      { confirm: data.url },
      message => {
        message
          .to(data.email)
          .from('before@before.com.br', 'BeforeTI')
          .subject('Como você perdeu o prazo, tente agora!');
      },
    );

    return data;
  }
}

module.exports = UserResendActive;
