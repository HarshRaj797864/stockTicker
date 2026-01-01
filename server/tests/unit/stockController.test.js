import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllStocks } from "../../controllers/stockController.js";
import * as stockService from "../../services/stockService.js";

vi.mock("../../services/stockService.js");

describe("stockController unit tests", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { query: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
  });

  it("should throw InvalidNumberError if page is 0", async () => {
    req.query.page = "0";

    await getAllStocks(req, res, next);

    expect(stockService.findAllStocks).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should call stockService with correct pagination math", async () => {
    req.query.page = "2";
    req.query.limit = "10";

    stockService.findAllStocks.mockResolvedValue({ data: [], total: 0 });

    await getAllStocks(req, res, next);

    expect(stockService.findAllStocks).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      search: "",
    });
  });
});
