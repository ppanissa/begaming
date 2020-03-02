const Mail = use('Mail');

class UserRegister {
  static get key() {
    return 'user.register.key';
  }

  async handle(job) {
    const { data } = job;

    await Mail.send('emails.auth.register', { confirm: data.url }, message => {
      message
        .to(data.email)
        .from('before@before.com.br', 'BeforeTI')
        .subject('Ative sua conta.');
    });

    return data;
  }
}

module.exports = UserRegister;
