
# I also made a little variant on the game of life a little while ago, while I was messing around with p5.js. You can find it in extra/index.html.

def get_neighbours(world: list[list[int]], position: tuple[int, int]) -> int:
    result = 0
    for x in range(position[0] - 1, position[0] + 2):
        for y in range(position[1] - 1, position[1] + 2):
            # skip anything past borders and the pos itself
            if x < 0 or x >= len(world[0]) or y < 0 or y >= len(world) or (x, y) == position:
                continue
            result += world[y][x]
    return result

assert get_neighbours([[1,0,1],
                      [1,1,1],
                      [0,0,0]], (1,1)) == 4
assert get_neighbours([[1,0,1],
                      [1,1,1],
                      [0,0,0]], (0,1)) == 2

"""
    Assume valid inputs, so input is a 2d list with len >= 1 where all the lists are the same size and all the elements in the lists are 0 or 1.
    Borders don't wrap around to the other side.
"""
def game_of_life(world: list[list[int]], nb_iterations: int = 5) -> list[list[int]]:
    for i in range(0, nb_iterations):
        # initialize neighbours matrix as matrix with the same size as input
        neighbours = [[0] * len(world[0]) for _ in range(len(world))]
        for y in range(0, len(world)):
            for x in range(0, len(world[0])):
                neighbours[y][x] = get_neighbours(world, (x, y))
        
        # update world
        for y in range(0, len(world)):
            for x in range(0, len(world[0])):
                if neighbours[y][x] <= 1 or neighbours[y][x] >= 4:
                    world[y][x] = 0 # cell dies
                elif neighbours[y][x] == 3:
                    world[y][x] = 1 # cell becomes/stays populated

    # Print result as unstyled HTML
    html = "<table>\n"
    for row in world:
        html += "<tr>"
        for cell in row:
            html += f"<td>{cell}</td>"
        html += "</tr>\n"
    html += "</table>"
    # print(html)

    return world


assert game_of_life([[0,1,0],
                     [0,1,0],
                     [0,1,0]], 1) == [[0,0,0],
                                      [1,1,1],
                                      [0,0,0]]
