import unittest
from PyDPD import getFileLines

class TestFileIO(unittest.TestCase):
  """
  A class for unit testing the input/output of PyDPD.
  """

  def testFileLines(self):
    """
    This test compares the output of two results which should have the same
    value. These values are the results of the following operations:
    - Reading the file into a string.
    - Calling PyDPD.getFileLines() to get a List of all lines in the file. Then
      adding all lines in the List together.
    The test file used is a Javascript file from the project JS-Dataset-Parser
    which was downloaded from "https://github.com/mikesiers/JS-Dataset-Parser".

    :param self: A parameter required for Python unit testing.
    """

    # Get the lines from the function in 'PyDPD.py' then add them together.
    lines = getFileLines('UnitTestData/JS-Dataset-Parser.js')
    addedLines = ''.join(lines)

    # Store the whole file into a string.
    file = open('UnitTestData/JS-Dataset-Parser.js')
    fileString = file.read()
    file.close()

    # Compare the equality of the two results.
    self.assertEqual(fileString, addedLines)

class TestLOCMetrics(unittest.TestCase):
  """
  A class for unit testing the various LOC metrics used in PyDPD.
  """

  def testLOCCount(self):
    """
    This test reads in the JS-Dataset-Parser.js file and compares the LOC
    count with the known amount (348)

    :param self: A parameter required for Python unit testing.
    """
    
    lines = getFileLines('UnitTestData/JS-Dataset-Parser.js')
    self.assertEqual(len(lines), 348)

if __name__ == '__main__':
  unittest.main()
