import countTicketsById from '../../../utils/countTicketsById';
import TicketModel from '../../../models/TicketModel';

describe('countTicketsById', () => {
  const projectId: string = '5e9f8f9f8f9f8f9f8f9f9f9';
  let status: string | null;

  it('should return the number of tickets by project id', async () => {
    status = null;

    TicketModel.countDocuments = jest.fn().mockResolvedValue(10);

    const res = await countTicketsById({ projectId, status });

    expect(res).toBe(10);
    expect(TicketModel.countDocuments).toHaveBeenCalledWith({
      projectId: '5e9f8f9f8f9f8f9f8f9f9f9',
    });
  });

  it('should return the number of tickets by project id with `Done` status', async () => {
    status = 'Done';

    TicketModel.countDocuments = jest.fn().mockResolvedValue(5);

    const res = await countTicketsById({ projectId, status });

    expect(res).toBe(5);
    expect(TicketModel.countDocuments).toHaveBeenCalledWith({
      projectId: '5e9f8f9f8f9f8f9f8f9f9f9',
      status: 'Done',
    });
  });
});
