describe("Basic Test", () => {
  it("should run basic Jest test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should verify Jest is working", () => {
    const message = "Jest is working!";
    expect(message).toBe("Jest is working!");
  });
});
