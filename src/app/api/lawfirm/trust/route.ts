import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List trust accounts and transactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get('tenantId') || 'demo-tenant';
    const type = searchParams.get('type') || 'accounts'; // accounts | transactions

    if (type === 'transactions') {
      const clientId = searchParams.get('clientId');
      const transactionType = searchParams.get('transactionType');

      const where: any = {
        tenantId,
        isDeleted: false,
      };

      if (clientId) {
        where.clientId = clientId;
      }
      if (transactionType) {
        where.type = transactionType;
      }

      const transactions = await db.lawTrustTransaction.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              fullName: true,
            },
          },
          case: {
            select: {
              id: true,
              caseNumber: true,
              title: true,
            },
          },
        },
        orderBy: {
          transactionDate: 'desc',
        },
      });

      // Calculate totals
      const totalDeposits = transactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalWithdrawals = transactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      return NextResponse.json({
        success: true,
        data: transactions,
        count: transactions.length,
        summary: {
          totalDeposits,
          totalWithdrawals,
          netMovement: totalDeposits - totalWithdrawals,
        },
      });
    }

    // Return trust accounts
    const accounts = await db.lawTrustAccount.findMany({
      where: {
        tenantId,
        isDeleted: false,
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          transactions: true,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    return NextResponse.json({
      success: true,
      data: accounts,
      count: accounts.length,
      summary: {
        totalInTrust: totalBalance,
        accountsCount: accounts.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching trust data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch trust data' },
      { status: 500 }
    );
  }
}

// POST - Create trust transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId = 'demo-tenant',
      type, // deposit | withdrawal
      clientId,
      caseId,
      amount,
      reference,
      description,
      transactionDate,
      checkNumber,
      bankName,
    } = body;

    // Get or create trust account for client
    let trustAccount = await db.lawTrustAccount.findFirst({
      where: {
        tenantId,
        clientId,
        isDeleted: false,
      },
    });

    if (!trustAccount) {
      trustAccount = await db.lawTrustAccount.create({
        data: {
          tenantId,
          clientId,
          accountNumber: `TRUST-${String(Date.now()).slice(-8)}`,
          balance: 0,
          status: 'active',
        },
      });
    }

    // Calculate new balance
    const currentBalance = trustAccount.balance || 0;
    const newBalance = type === 'deposit' 
      ? currentBalance + amount 
      : currentBalance - amount;

    // Validate withdrawal
    if (type === 'withdrawal' && newBalance < 0) {
      return NextResponse.json(
        { success: false, error: 'Insufficient trust balance for withdrawal' },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await db.lawTrustTransaction.create({
      data: {
        tenantId,
        trustAccountId: trustAccount.id,
        clientId,
        caseId,
        type,
        amount,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        reference,
        description,
        transactionDate: transactionDate || new Date().toISOString().split('T')[0],
        checkNumber,
        bankName,
        status: 'completed',
      },
    });

    // Update trust account balance
    await db.lawTrustAccount.update({
      where: { id: trustAccount.id },
      data: { balance: newBalance },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Trust transaction recorded successfully',
    });
  } catch (error: any) {
    console.error('Error creating trust transaction:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create trust transaction' },
      { status: 500 }
    );
  }
}
