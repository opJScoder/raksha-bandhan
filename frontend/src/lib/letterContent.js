// Each letter is built as an ordered list of segments so the writing
// engine can pause on photos/gifts/rakhi at exactly the right beat.
// { type: 'text', value }  — words revealed progressively
// { type: 'gift' }         — brother's gift photo or amount
// { type: 'rakhi' }        — sister's rakhi
// { type: 'memory' }       — the optional memory photo

export function brotherLetter({ senderName, recipientName, gift }) {
  const segments = [
    { type: 'text', value: `Hi, I'm ${senderName},\n\n` },
    {
      type: 'text',
      value: `Every year I say I'll plan something better for Rakhi, and every year I end up writing you a letter at the last minute — some things don't change, and honestly, neither should we.\n\n`,
    },
    {
      type: 'text',
      value: `You've spent most of your life putting up with me, ${recipientName}, and somehow you still pick up when I call. That's not a small thing. I don't say it enough, so I'm saying it here: thank you for being the one person who's always, always in my corner.\n\n`,
    },
    { type: 'text', value: `This year, I wanted to give you something properly, so —\n\n` },
    { type: 'gift' },
    {
      type: 'text',
      value: `\n\nIt's not much compared to everything you've done for me, but I hope it makes you smile the way you make me smile, even on the days I don't show it.\n\n`,
    },
  ];

  segments.push({ type: 'memory' });

  segments.push({
    type: 'text',
    value: `\n\nHappy Raksha Bandhan, ${recipientName}. Tie the rakhi tight this year — I'm not going anywhere.\n\nWith all my love,\n${senderName}`,
  });

  return segments;
}

export function sisterLetter({ senderName, recipientName }) {
  const segments = [
    { type: 'text', value: `Hi, I'm ${senderName},\n\n` },
    {
      type: 'text',
      value: `I was going through old photos looking for one to send you and got completely distracted for an hour — we look so young, and somehow you still make the same face in every single one.\n\n`,
    },
    {
      type: 'text',
      value: `${recipientName}, you drive me a little crazy sometimes, but you've also been the steadiest person in my life since before I even knew what that meant. This letter is just my way of saying I notice all of it — the small things, the big things, the showing up.\n\n`,
    },
    { type: 'text', value: `So this year, before anything else —\n\n` },
    { type: 'rakhi' },
    {
      type: 'text',
      value: `\n\nMay it remind you, on the days you need reminding, that you've got someone permanently on your side.\n\n`,
    },
  ];

  segments.push({ type: 'memory' });

  segments.push({
    type: 'text',
    value: `\n\nHappy Raksha Bandhan, ${recipientName}. Come get your rakhi tied properly, and bring snacks.\n\nLove always,\n${senderName}`,
  });

  return segments;
}
