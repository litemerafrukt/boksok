#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exit with 0 on success, 1 on fail
"""
import sys
import os
import getopt
import traceback
import json

EXIT_SUCCESS = 0
EXIT_FAIL = 1

# Script info and usage
PROGRAM = os.path.basename(sys.argv[0])
AUTHOR = "4ny"
VERSION = "0.1a"
USAGE = """{program}
By {author}
Version {version}

Usage:
  {program} [options]

  Parse a csv to json. Current version is specificly targeted towards
  biblioteksdatabasen.cvs -> json.

Options:
  --skip=<line_nr>  Skip this line
  --keys=<line_nr>  Tell what line kontain headers that will be keys, default line 1
  -h, --help        Display this help message.
""".format(program=PROGRAM, author=AUTHOR, version=VERSION)


def print_help(exit_status):
    """
    Print helptext and exit
    """
    print(USAGE)
    sys.exit(exit_status)


def main(argv):
    """
    Main function, parse arguments and do as told
    """

    # Keys on first row as default
    keys_line_nr = 1
    skip_line = 0

    try:
        opts, args = getopt.getopt(argv, "h", ["help", "keys=", "skip="])

        for opt, arg in opts:
            if opt in ("-h", "--help"):
                print_help(EXIT_SUCCESS)
            elif opt in "--keys":
                # Setting line that contains the headers to use for keys
                keys_line_nr = int(arg)
                # print('Setting keys from line {}'.format(keys_line_nr))
            elif opt in "--skip":
                skip_line = int(arg)
                # print('Skipping line: {}'.format(skip_line))
            else:
                assert False, "Unhandled option"

    except Exception as err:
        print(err)
        # Prints the callstack, good for debugging, comment out for production
        traceback.print_exception(Exception, err, None)
        print("\n---\n")
        print_help(EXIT_FAIL)

    # Read cvs
    if len(args) == 1:
        try:
            cvs_file = open(args[0])
        except IOError:
            print('Error in opening file')

        line_number = 0
        keys = []
        entry = {}
        out = {'libraries': []}

        for line in cvs_file.readlines():
            line_number += 1
            line = line.strip()
            if (line_number == skip_line):
                # print('skipping')
                continue

            if (line_number == keys_line_nr):
                keys = line.split('|')
                # print('Keys: {}'.format(keys))
                continue

            if (len(keys) > 0):
                values = line.split('|')
                # print(line)
                index = 0
                for key in keys:
                    if values[index] == '':
                        entry[key] = None
                    else:
                        entry[key] = values[index]
                    index += 1
                # print('{}'.format(entry))
                out['libraries'].append(entry)
                entry = {}

        print(json.dumps(out, ensure_ascii=False, indent=4, sort_keys=True))
        cvs_file.close()
    else:
        print('No input file')


if __name__ == "__main__":
    main(sys.argv[1:])
