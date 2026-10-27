
Backend: Java


**Formatting**:


_Block Indentation_:

All blocks will be indented using spaces, not tabs

In a block of code, subsequent lines will be indented 2 spaces until that code is finished

The code will return to it's starting position once the block of code is finished

The end curly bracket must match the beginning of the statement. 

_Horizontal Whitespace:_

A space is required between operands, before any {}, array values, and any =


Vertical Whitespace should be used before and after a method and class declaration, and to group relevant pieces of code. 


_Naming Conventions:_

All names should be descriptive of what the class, method, or variable is doing.

All classes, interfaces, and Generic Type Parameters will be in UpperCamelCase i.e. MyClass

All methods and local variables will be written in lowelCamelCase i.e. finalSum

All constants should be declared as fully uppercase i.e. INTEGER_MAX

Example:

    public static void main(args[]) {

      for(int i = 0; i < 5; i++) {
        System.out.println(i);
      }
        
      int thingOneInt = 0;
      String thingOneStr = "";
        
	  int thingTwoInt = 0;
      String thingTwoStr = "";
    }

**Frontend: JavaScript**

Will use style guides outlined by [Prettier ESlint](https://www.npmjs.com/package/prettier-eslint)
