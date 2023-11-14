function copy(text: string) {
  const fakeElem = document.createElement('textarea');

  // Prevent zooming on iOS
  fakeElem.style.fontSize = '1rem';

  // Reset box model
  fakeElem.style.border = '0';
  fakeElem.style.padding = '0';
  fakeElem.style.margin = '0';

  // Move element out of screen horizontally
  fakeElem.style.position = 'absolute';
  fakeElem.style.left = '-9999px';

  // Move element to the same position vertically
  const yPosition = window.pageYOffset || document.documentElement.scrollTop;
  fakeElem.style.top = `${yPosition}px`;

  fakeElem.setAttribute('readonly', '');
  fakeElem.value = text;

  document.body.appendChild(fakeElem);

  fakeElem.select();
  fakeElem.setSelectionRange(0, fakeElem.value.length);

  document.execCommand('copy');

  window.getSelection()?.removeAllRanges();
  document.body.removeChild(fakeElem);
}

export default copy;