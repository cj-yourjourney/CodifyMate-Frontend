def increasingTriplet(nums):
    first = 10**9  # A large integer
    second = 10**9  # Another large integer

    for num in nums:
        if num <= first:
            first = num
        elif num <= second:
            second = num
        else:
            return True  # Found a number greater than both first and second

    return False  # No triplet found


# Example usage:
print(increasingTriplet([1, 2, 3, 4, 5]))  # Output: True
print(increasingTriplet([5, 4, 3, 2, 1]))  # Output: False
print(increasingTriplet([2, 1, 5, 0, 4, 6]))  # Output: True
