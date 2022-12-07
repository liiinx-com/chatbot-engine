export const getActionButton = ({ id, title, type = 'reply' }) => ({
  type,
  reply: {
    id,
    title,
  },
});

export const getInteractiveMsgFrom = ({
  to,
  bodyText,
  action,
  footerText = undefined,
  header = undefined,
}) => ({
  to,
  type: 'interactive',
  action,
  interactive: {
    type: 'button',
    body: {
      text: bodyText,
    },
    ...(footerText
      ? {
          footer: {
            text: footerText,
          },
        }
      : {}),
    ...(header ? header : {}),
  },
});
