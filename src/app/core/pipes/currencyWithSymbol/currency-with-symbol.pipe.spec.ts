import { CurrencyWithSymbolPipe } from './currency-with-symbol.pipe';

describe('CurrencyWithSymbolPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyWithSymbolPipe();
    expect(pipe).toBeTruthy();
  });
});
