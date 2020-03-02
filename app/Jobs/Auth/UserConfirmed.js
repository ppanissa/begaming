const Mail = use('Mail');

class UserConfirmed {
  static get key() {
    return 'UserConfirmed-key';
  }

  async handle(job) {
    const { data } = job; // the 'data' variable has user data

    await Mail.send(
      'emails.auth.user-confirmed',
      { username: data.username },
      message => {
        message
          .to(data.email)
          .from('before@before.com.br', 'BeforeTI')
          .subject('Seja bem vindo a intranet da Before.');
      },
    );

    return data;
  }
}

module.exports = UserConfirmed;
