def getFileLines(filename):
    file = open(filename)
    lines = file.readLines()
    file.close()
    return lines