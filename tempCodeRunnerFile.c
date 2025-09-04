#include <stdio.h>


int main() {
    char letter = 'A';
    int age = 25;
    float pi = 3.14f;
    double price = 99.99;
    long population = 8000000;

    printf("Char: %c\n", letter);          // %c → char
    printf("Int: %d\n", age);              // %d → int
    printf("Float: %.2f\n", pi);           // %f → float (2 decimal places)
    printf("Double: %.2lf\n", price);      // %lf → double
    printf("Long: %ld\n", population);
    return 0;
}