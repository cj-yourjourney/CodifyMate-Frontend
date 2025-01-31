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


def findMaxAverage(nums, k):
    # Calculate the sum of the first k elements
    current_sum = sum(nums[:k])
    max_sum = current_sum

    # Sliding window to find the maximum sum of any k-length subarray
    for i in range(k, len(nums)):
        current_sum += nums[i] - nums[i - k]  # Slide the window
        max_sum = max(max_sum, current_sum)  # Update max_sum if needed

    # Calculate the maximum average
    return max_sum / k  # Corrected to divide by k


# Example usage
print(findMaxAverage([1, 12, -5, -6, 50, 3], 4))  # Output: 12.75
print(findMaxAverage([5], 1))  # Output: 5.0
