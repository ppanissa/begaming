const Mail = use('Mail');

class UserRecoveryPassword {
  static get key() {
    return 'UserRecoveryPassword-key';
  }

  async handle(job) {
    const { data } = job; // the 'data' variable has user data

    await Mail.send(
      'emails.auth.recovery-password',
      { recovery: data.recovery, user: data.user.username },
      message => {
        message
          .to(data.user.email)
          .from('before@before.com.br', 'BeforeTI')
          .subject('Recuperar senha.');
      },
    );

    return data;
  }
}

module.exports = UserRecoveryPassword;
