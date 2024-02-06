Thanks to this post: https://forums.mirthproject.io/forum/mirth-connect/support/184605-sftp-fails-because-server-wants-ssh-rsa

and @Anthony Master from Mirth Slack:

SFTP in 4.5 dropped support for ssh-rsa algo and a few others. The workaround is to add these two options in each affected SFTP connectpr settings.  See https://github.com/nextgenhealthcare/connect/issues/5608 for issue that prompted drop in replacement for jsch.

![image](https://github.com/pacmano1/Mirth-Snippets/assets/44065187/bf0874a8-22ac-4246-a92c-17340a7aff98)
