// @jest-environment jsdom
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConnectionsGameContextProvider } from './contexts/ConnectionsGameContext';
import ConnectionsPage from './ConnectionsPage';
import { DarkModeProvider } from '../header/contexts/useDarkMode';

// Constants
const BACKSPACE = '{Backspace}';
const ENTER = '{Enter}';
const KEYBOARD_LABEL = 'keyboard-';
const BOARD_ROW_LABEL = 'board-row-';

const loadCardsMock = vi.fn();
const submitToVerifyMock = vi.fn();

beforeEach(() => {
  cleanup();
  // Mock localStorage to avoid errors
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  vi.spyOn(Storage.prototype, 'setItem').mockReturnValue();
  Storage.prototype.removeItem = vi.fn();
  loadCardsMock.mockReturnValue(["Card 1", "Card 2", "Card 3", "Card 4", "Card 5", "Card 6", "Card 7", "Card 8", "Card 9", "Card 10", "Card 11", "Card 12", "Card 13", "Card 14", "Card 15", "Card 16"]);
  submitToVerifyMock.mockReturnValue({data: false});

  render(
    <DarkModeProvider>
      <ConnectionsGameContextProvider withCache={false} loadCardsFn={loadCardsMock} submitToVerifyFn={submitToVerifyMock}>
        <ConnectionsPage />
      </ConnectionsGameContextProvider>
    </DarkModeProvider>
  );
});

afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * Tests to see basic UI functionality. For example, clicking a card should select it, clicking it again should deselect it.
 */
describe('Basic UI tests', () => {
    it('should render the game board', () => {
        for (let i = 1; i <= 16; i++) {
            expect(screen.getByText("Card " + i)).toBeTruthy();
        }
    });

    it('should select a card when clicked', async () => {
        const card = screen.getByText("Card 1");
        await userEvent.click(card);
        expect(screen.getByText("Card 1").classList.contains("clicked")).toBeTruthy();
        for (let i = 2; i <= 16; i++) {
            expect(screen.getByText("Card " + i).classList.contains("clicked")).toBeFalsy();
        }
    });

    it('should deselect a card when clicked again', async () => {
        const card = screen.getByText("Card 1");
        await userEvent.click(card);
        await userEvent.click(card);
        for (let i = 1; i <= 16; i++) {
            expect(screen.getByText("Card " + i).classList.contains("clicked")).toBeFalsy();
        }
    });
});

/**
 * Tests to see if the game board is functioning correctly.
 */
describe('Submission tests', () => {
    it('should not submit if less than 4 cards are selected', async () => {
        await userEvent.click(screen.getByText("Card 1"));
        await userEvent.click(screen.getByText("Card 2"));
        await userEvent.click(screen.getByText("Card 3"));
        await userEvent.click(screen.getByText("Submit"));
        expect(submitToVerifyMock).not.toHaveBeenCalled();
    });

    it('should submit if 4 cards are selected', async () => {
        await userEvent.click(screen.getByText("Card 1"));
        await userEvent.click(screen.getByText("Card 2"));
        await userEvent.click(screen.getByText("Card 3"));
        await userEvent.click(screen.getByText("Card 4"));
        await userEvent.click(screen.getByText("Submit"));
        expect(submitToVerifyMock).toHaveBeenCalled();
    });

    it('should delete one attempt if the submission is incorrect', async () => {
        await userEvent.click(screen.getByText("Card 1"));
        await userEvent.click(screen.getByText("Card 2"));
        await userEvent.click(screen.getByText("Card 3"));
        await userEvent.click(screen.getByText("Card 4"));
        await userEvent.click(screen.getByText("Submit"));
        // Count of divs with class vAttempt should be 3
        expect(screen.getByLabelText("attempts-bar").querySelectorAll('.vAttempt').length).toBe(3);
    });

    it('should update the card status if correct', async () => {
        // Set new data to be returned by the mock so it accepts answer
        submitToVerifyMock.mockReturnValue({data: true});
        await userEvent.click(screen.getByText("Card 1"));
        await userEvent.click(screen.getByText("Card 2"));
        await userEvent.click(screen.getByText("Card 3"));
        await userEvent.click(screen.getByText("Card 4"));
        await userEvent.click(screen.getByText("Submit"));
        // Card 1 to 4 should have correct level and be unclickable
        for (let i = 1; i <= 4; i++) {
            expect(screen.getByText("Card " + i).classList.contains("level1")).toBeTruthy(); // TODO: "level1" might change depending on the integration
            await userEvent.click(screen.getByText("Card " + i));
            expect(screen.getByText("Card " + i).classList.contains("clicked")).toBeFalsy();
        }
    });
});

/**
 * Tests to check if game works from start to finish.
 */
describe('Gameplay tests', () => {
    it('should end on the fourth correct submission', async () => {
        // Set new data to be returned by the mock so it accepts answer
        submitToVerifyMock.mockReturnValue({data: true});
        for (let i = 1; i <= 4; i++) {
            await userEvent.click(screen.getByText("Card " + i));
            await userEvent.click(screen.getByText("Card " + (i + 4)));
            await userEvent.click(screen.getByText("Card " + (i + 8)));
            await userEvent.click(screen.getByText("Card " + (i + 12)));
            await userEvent.click(screen.getByText("Submit"));
        }
        expect(screen.getByText("You Win!")).toBeTruthy();
    });

    it('should end on the fourth incorrect submission', async () => {
        for (let i = 1; i <= 4; i++) {
            await userEvent.click(screen.getByText("Card " + i));
            await userEvent.click(screen.getByText("Card " + (i + 4)));
            await userEvent.click(screen.getByText("Card " + (i + 8)));
            await userEvent.click(screen.getByText("Card " + (i + 12)));
            await userEvent.click(screen.getByText("Submit"));
        }
        expect(screen.getByText("Game Over!")).toBeTruthy();
    });
});