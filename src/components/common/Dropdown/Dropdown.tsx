"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Menu, MenuTarget, MenuDropdown, MenuItem } from "@mantine/core";
import classes from "./Dropdown.module.css";

interface DropdownProps {
  options: string[];
  placeholder: string;
  selectedOption?: string | null;
  onOptionClick?: (option: string) => void;
  fullWidth?: boolean;
}

export function Dropdown({
  options,
  placeholder,
  selectedOption,
  onOptionClick = function (): void {
    throw new Error("Function not implemented.");
  },
  fullWidth = false,
}: DropdownProps) {
  const [opened, setOpened] = React.useState<boolean>(false);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);
  const menuTargetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (fullWidth && menuTargetRef.current) {
      setDropdownWidth(menuTargetRef.current.offsetWidth - 2);
    }
  }, [fullWidth, opened]);

  const handleOptionClick = (option: string) => {
    onOptionClick(option);
    setOpened(false);
  };

  return (
    <Menu offset={0} opened={opened} onChange={setOpened}>
      <MenuTarget>
        <Button
          ref={menuTargetRef}
          justify="space-between"
          className={`${classes.dropdownToggle} ${opened ? classes.opened : ""} ${fullWidth && classes.fullWidthToggle}`}
          onClick={() => setOpened(!opened)}
          leftSection={<span className={classes.buttonLabel}>{selectedOption || placeholder}</span>}
          rightSection={
            <span className={classes.toggleIcon}>
              {opened ? (
                /* opened dropdown = Lets Icons v1.0 Single Arrow Arrow_drop_up */
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.1921 9.23047L15.9065 13.6879C16.3408 14.2089 15.9702 15 15.292 15L8.70803 15C8.02976 15 7.65924 14.2089 8.09346 13.6879L11.8079 9.23047C11.9079 9.11053 12.0921 9.11053 12.1921 9.23047Z" />
                </svg>
              ) : (
                /* closed dropdown = Lets Icons v1.0 Single Arrow Arrow_drop_down */
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.8079 14.7695L8.09346 10.3121C7.65924 9.79109 8.02976 9 8.70803 9L15.292 9C15.9702 9 16.3408 9.79108 15.9065 10.3121L12.1921 14.7695C12.0921 14.8895 11.9079 14.8895 11.8079 14.7695Z" />
                </svg>
              )}
            </span>
          }
        ></Button>
      </MenuTarget>
      <MenuDropdown className={classes.dropdownList} style={{ width: dropdownWidth }}>
        {options.map((option) => (
          <MenuItem
            key={option}
            className={`${classes.dropdownItem} ${fullWidth && classes.fullWidthItem}`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}
