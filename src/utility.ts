/**
 * grab bag of small helpers used throughout
 */
class Utility {
  public getType(ref?: string): string | null {
    if (!ref) {
      return null;
    }
    return ref.replace('#/components/schemas/', '');
  }

  public isPrimitive(type?: string): boolean {
    if (!type) {
      return true;
    }
    const primitives = ['string', 'integer', 'number', 'boolean'];
    return primitives.includes(type);
  }

  public isComplexType(type?: string): boolean {
    return !this.isPrimitive(type);
  }

  public isCustomType(type?: string): boolean {
    if (!type) {
      return false;
    }
    return !['string', 'integer', 'number', 'boolean', 'object'].includes(type);
  }

  public makePascalCase(input: string): string {
    return input
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
      .join('');
  }

  public makeCamelCase(input: string): string {
    return input
      .replace(/\s(.)/g, $1 => $1.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^(.)/, $1 => $1.toLowerCase());
  }
}

export default new Utility();
