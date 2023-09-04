import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyWithSymbol'
})
export class CurrencyWithSymbolPipe implements PipeTransform {
  transform(value: any): string {
    return `$${value}`;
  }
}
