def getFileLines(filename):
    """
	Returns the lines from a file as a list.

    :param filename: The file name of the file to get the lines of.
	:returns: List[str] - A list of strings where each string represents a line 
	in the file.
    """
    file = open(filename)
    lines = file.readLines()
    file.close()
    return lines