def factorial(n):
    """
    Calculates the factorial of a non-negative integer n using recursion.

    Parameters:
    n (int): A non-negative integer for which to calculate the factorial.

    Returns:
    int: The factorial of the number n.
    """
    # Check if the input is a non-negative integer
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers.")
    
    # Base case: the factorial of 0 is 1
    if n == 0:
        return 1
    
    # Recursive case: n! = n * (n-1)!
    return n * factorial(n - 1)

# Example usage
try:
    number = 5
    result = factorial(number)
    print(f"The factorial of {number} is: {result}")
except ValueError as e:
    print(e)