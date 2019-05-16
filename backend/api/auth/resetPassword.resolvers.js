const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const config = require('../../utils/config')
const SHA256 = require('../../utils/SHA256')

const Email = require('../../utils/email')
const ResetPasswordEmail = require('../../email-templates/resetPasswordEmail')
const ResetPasswordConfirmationEmail = require('../../email-templates/resetPasswordConfirmationEmail')

module.exports = {
  Mutation: {
    async resetPassword (obj, args, context) {
      const { email } = args
      const { db, logger } = context

      const userEmail = email.toLowerCase().trim()
      if (validator.isEmail(userEmail)) {
        const matchRegex = new RegExp(`^${userEmail}$`, 'i')
        const user = await db.collection('users').findOne({ 'email': { $regex: matchRegex } })
        if (!user) {
          throw Error('Email does not exist!')
        }

        const resetToken = jwt.sign(
          {
            pw: user.password,
            userId: user._id
          },
          config.SESSION_SECRET,
          { expiresIn: '24h' }
        )

        Email.send({
          to: userEmail,
          subject: 'Reset your Uptrade account password',
          html: ResetPasswordEmail({
            link: `${config.FRONTEND_URL}/user/reset-password?token=${resetToken}`,
            imagesUrl: 'https://via.placeholder.com/150'
          })
        }).then(() => {
          logger.info(`Send reset password email to ${userEmail}`)
        }).catch(err => {
          logger.error(err)
        })

        return {
          success: true
        }
      }
      throw Error('Not a valid email')
    },
    async confirmPasswordReset (obj, args, context) {
      const { token, password } = args
      const { db, logger } = context
      const decoded = jwt.verify(token, config.SESSION_SECRET)
      if (decoded && decoded.pw) {
        const { userId } = decoded
        const duplicated = await bcrypt.compare(SHA256(password), decoded.pw)
        if (!duplicated) {
          const salt = bcrypt.genSaltSync(config.SALT_ROUNDS)
          const _password = await bcrypt.hash(SHA256(password), salt)
          const r = await db.collection('users').findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                password: _password
              }
            },
            { returnOriginal: false }
          )

          const updatedUser = r.value
          Email.send({
            to: updatedUser.email,
            subject: 'Your uptrade password has been reset successfully',
            html: ResetPasswordConfirmationEmail({
              link: `${config.FRONTEND_URL}/user/login`,
              imagesUrl: 'https://via.placeholder.com/150'
            })
          }).then(() => {
            logger.info(`Send reset password confirmation email to ${updatedUser.email}`)
          }).catch(err => {
            logger.error(err)
          })
          return {
            user: updatedUser,
            token: jwt.sign({ userId }, config.SESSION_SECRET)
          }
        }
        throw Error('New password is similar to the current one')
      }
      throw Error('Invalid reset token')
    }
  }
}
