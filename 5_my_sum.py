
def my_sum_iterative(input: list[float]) -> float:
    result = 0
    for i in input:
        result += i
    return result

def my_sum_recursive(input: list[float], agg = 0) -> float:
    if len(input) == 0:
        return agg
    return my_sum_recursive(input[1:], agg + input[0])


print(my_sum_iterative([1,2,3,4,5,6,7]))
print(my_sum_recursive([1,2,3,4,5,6,7]))