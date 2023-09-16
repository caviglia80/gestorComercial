import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 18, ellipsis: string = '..'): string {
    if (value.length === 0) return " ";
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }
}
