
def fizzBuzz(input: list[int] = [i for i in range(1, 101)],
            mult_map: dict[int, str] = {
                3: "Fizz",
                5: "Buzz",
                # 12: "Lazz"
                }
            ):
    for i in input:
        for (divisor, word) in mult_map.items():
            print(word if i % divisor == 0 else "", end = "") # don't attach newline at the end
        print("")

fizzBuzz()